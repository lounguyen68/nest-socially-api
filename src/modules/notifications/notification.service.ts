import { Injectable, Logger } from '@nestjs/common';
import {
  Expo,
  ExpoPushMessage,
  ExpoPushTicket,
  ExpoPushSuccessTicket,
} from 'expo-server-sdk';
import { Message } from '../messages/interfaces/message.interface';
import { MessageType } from 'src/common/const';

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);
  private expo: Expo;

  constructor() {
    this.expo = new Expo({
      accessToken: process.env.EXPO_ACCESS_TOKEN,
    });
  }

  createNotificationMessage(title: string, message: Message) {
    const notificationMessage = {
      title,
      body: '',
      data: {
        conversationId: message.conversation,
      },
      sound: 'default',
    };

    switch (message.type) {
      case MessageType.TEXT:
        notificationMessage.body = message.content;
        break;
      case MessageType.IMAGE:
        notificationMessage.body = `Đã gửi ${message.attachments.length} hình ảnh`;
        break;
      case MessageType.FILE:
        notificationMessage.body = `Đã gửi ${message.attachments.length} tệp tin`;
        break;
      case MessageType.VIDEO:
        notificationMessage.body = `Đã gửi ${message.attachments.length} video`;
        break;
    }

    return notificationMessage;
  }

  // Method to send push notifications
  async sendNotifications(
    pushTokens: string[],
    message: Omit<ExpoPushMessage, 'to'>,
  ): Promise<void> {
    const validTokens = this.filterValidTokens(pushTokens);
    if (validTokens.length === 0) {
      this.logger.warn('No valid Expo push tokens found.');
      return;
    }

    const messages = validTokens.map((token) => ({
      ...message,
      to: token,
    }));

    const chunks = this.expo.chunkPushNotifications(messages);
    const tickets: ExpoPushTicket[] = [];

    for (const chunk of chunks) {
      try {
        const ticketChunk = await this.expo.sendPushNotificationsAsync(chunk);
        this.logger.log(`Tickets received: ${JSON.stringify(ticketChunk)}`);
        tickets.push(...ticketChunk);
      } catch (error) {
        this.logger.error('Error sending notification chunk', error);
      }
    }

    this.handleTickets(tickets);
  }

  // Filter valid Expo push tokens
  private filterValidTokens(pushTokens: string[]): string[] {
    return pushTokens.filter((token) => {
      if (!Expo.isExpoPushToken(token)) {
        this.logger.warn(`Invalid Expo push token: ${token}`);
        return false;
      }
      return true;
    });
  }

  // Handle tickets and collect receipt IDs for tracking
  private async handleTickets(tickets: ExpoPushTicket[]): Promise<void> {
    const receiptIds = tickets
      .filter(
        (ticket): ticket is ExpoPushSuccessTicket =>
          ticket.status === 'ok' && 'id' in ticket,
      )
      .map((ticket) => ticket.id);

    if (receiptIds.length > 0) {
      await this.checkReceipts(receiptIds);
    }
  }

  private async checkReceipts(receiptIds: string[]): Promise<void> {
    const receiptIdChunks =
      this.expo.chunkPushNotificationReceiptIds(receiptIds);

    for (const chunk of receiptIdChunks) {
      try {
        const receipts =
          await this.expo.getPushNotificationReceiptsAsync(chunk);
        this.logger.log(`Receipts received: ${JSON.stringify(receipts)}`);

        for (const receiptId in receipts) {
          const receipt = receipts[receiptId];

          if (receipt.status === 'error') {
            const errorMessage = receipt?.message ?? 'Unknown error message';
            this.logger.error(
              `Error with notification receipt: ${errorMessage}`,
            );

            if (receipt.details && receipt.details.error) {
              this.logger.error(`Error details: ${receipt.details.error}`);
            }
          }
        }
      } catch (error) {
        this.logger.error('Error checking notification receipts', error);
      }
    }
  }
}
