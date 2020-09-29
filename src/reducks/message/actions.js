export const MESSAGE = "MESSAGE";
export const messageAction = (message) => {
    return {
        type: "MESSAGE",
        payload: {
            type: message.type,
            content: message.content
        }
    }
}