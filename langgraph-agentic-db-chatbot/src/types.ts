import { addMessages, Annotation } from "@langchain/langgraph";
import { BaseMessage } from "langchain";

export const ChatState = Annotation.Root({
  messages: Annotation<BaseMessage[]>({
    reducer: addMessages,
  }),
});
