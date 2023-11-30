import { createContext, PropsWithChildren, useRef, useState } from "react";
import ConfirmDialog from "../Dialogs/ConfirmDialog";
import PromptDialog from "../Dialogs/PromptDialog";

export type IConfirmContext = {
  confirm: (message: string) => Promise<boolean>;
  prompt: (message: string, defaultText?: string) => Promise<string>;
};

export const ConfirmContext = createContext<IConfirmContext>(undefined!);

function ConfirmProvider({ children }: PropsWithChildren) {
  const [openConfirm, setOpenConfirm] = useState(false);
  const [openPrompt, setOpenPrompt] = useState(false);
  const [message, setMessage] = useState("");
  const [defaultText, setDefaultText] = useState("");

  const response = useRef<(value: boolean | PromiseLike<boolean>) => void>(
    undefined!
  );

  const promptResponse = useRef<(value: string | PromiseLike<string>) => void>(
    undefined!
  );

  const onConfirm = (confirm: boolean) => {
    if (response.current) response.current(confirm);
  };

  const onPrompt = (confirm: string) => {
    if (promptResponse.current) promptResponse.current(confirm);
  };

  const onClose = () => {
    setOpenConfirm(false);
    setOpenPrompt(false);
  };

  const confirm = (contentMessage: string): Promise<boolean> => {
    setMessage(contentMessage);
    setOpenConfirm(true);
    return new Promise<boolean>((resolve) => {
      response.current = resolve;
    });
  };

  const prompt = (
    contentMessage: string,
    defaultContentText?: string
  ): Promise<string> => {
    setMessage(contentMessage);
    setDefaultText(defaultContentText || "");
    setOpenPrompt(true);
    return new Promise<string>((resolve) => {
      promptResponse.current = resolve;
    });
  };

  return (
    <ConfirmContext.Provider value={{ confirm, prompt }}>
      {children}
      <ConfirmDialog
        open={openConfirm}
        setOpen={onClose}
        message={message}
        onConfirm={onConfirm}
      />

      <PromptDialog
        defaultText={defaultText}
        open={openPrompt}
        setOpen={onClose}
        message={message}
        onConfirm={onPrompt}
      />
    </ConfirmContext.Provider>
  );
}

export default ConfirmProvider;
