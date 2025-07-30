import Message from "#app/models/message.model";
import Conversation from "#app/models/conversation.model";

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
      throw new error();
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
      throw new error();
    }
  }

  async saveMessageAndConversation(conversation, message) {
    try {
      conversation.messages.push(message._id);
      await Promise.all([conversation.save(), message.save()]);

      return message;
    } catch (error) {
      throw new error();
    }
  }

  async getConversationMessages(senderId, userToChatId) {
    try {
      const conversation = await Conversation.findOne({
        participants: { $all: [senderId, userToChatId] },
      }).populate("messages");

      if (!conversation) {
        return [];
      }

      return conversation.messages;
    } catch (error) {
      throw new error();
    }
  }

  formatMessageResponse(message) {
    return {
      _id: message._id,
      senderId: message.senderId,
      receiverId: message.receiverId,
      message: message.message,
      createdAt: message.createdAt,
      updatedAt: message.updatedAt,
    };
  }
}

export default new MessageService();
