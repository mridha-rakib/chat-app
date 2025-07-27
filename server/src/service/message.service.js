import Message from "#app/models/message.model";
import Conversation from "#app/models/conversation.model";
import { NotFoundException, BadRequestException } from "#app/utils/error-handler.utils";
import { ErrorCodeEnum } from "#app/enums/error-code.enum";

class MessageService {
  async findOrCreateConversation(senderId, receiverId) {
    try {
      let conversation = await Conversation.findOne({
        participants: { $all: [senderId, receiverId] },
      });

      if (!conversation) {
        conversation = await Conversation.create({
          participants: [senderId, receiverId],
        });
      }

      return conversation;
    } catch (error) {
      throw new BadRequestException(
        "Failed to create or find conversation",
        ErrorCodeEnum.DATABASE_ERROR
      );
    }
  }

  async createMessage(messageData) {
    try {
      const { senderId, receiverId, message } = messageData;

      const newMessage = new Message({
        senderId,
        receiverId,
        message,
      });

      return newMessage;
    } catch (error) {
      throw new BadRequestException("Failed to create message", ErrorCodeEnum.DATABASE_ERROR);
    }
  }

  
}

export default new MessageService();
