import { processAssistantChat } from '../services/assistantService.js';

// @desc   Conversational agriculture advisory chat
// @route  POST /api/assistant/chat
export const chatWithAssistant = async (req, res, next) => {
  try {
    const { message, history } = req.body;

    if (!message || message.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Please provide a message or question.'
      });
    }

    const result = await processAssistantChat({
      message: message.trim(),
      history: history || []
    });

    res.json({
      success: true,
      data: result
    });
  } catch (err) {
    next(err);
  }
};
