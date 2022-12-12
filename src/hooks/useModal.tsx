import React, { createContext, useContext, useState } from "react";

interface ModalContextInterface {
  createModal: (modalInfo: ModalInfo) => void;
  closeModal: () => void;
}

export const ModalContext = createContext<ModalContextInterface | null>(null);
export const useModalContext = () => useContext(ModalContext);

export const ModalProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [show, setShow] = useState<boolean>(false);
  const [modalInfo, setModalInfo] = useState<ModalInfo | undefined>();

  const createModal: (modalInfo: ModalInfo) => void = (modalInfo) => {
    setModalInfo(modalInfo);
    return setShow(true);
  };

  const closeModal = () => {
    return setShow(false);
  };

  return (
    <>
      <ModalContext.Provider value={{ createModal, closeModal }}>
        {children}
        <Modal modalInfo={modalInfo} show={show} closeModal={closeModal} />
      </ModalContext.Provider>
    </>
  );
};

type ModalInfo = {
  title: React.FC;
  gui: React.FC;
};

const Modal: React.FC<{
  modalInfo?: ModalInfo;
  show: boolean;
  closeModal: () => void;
}> = ({ modalInfo, show, closeModal }) => {
  return (
    <div
      className={`${
        show ? "absolute" : "hidden"
      } inset-0 grid place-content-center backdrop-blur-sm`}
    >
      <div className="flex flex-col rounded-lg bg-slate-100 px-8 py-3 text-black shadow-2xl dark:bg-gray-800 dark:text-white">
        <div className="flex justify-between gap-8">
          <span className="mr-2 text-2xl">
            {modalInfo?.title && <modalInfo.title />}
          </span>
          <button
            onClick={() => closeModal()}
            className="rounded-xl bg-red-600 p-2 transition-colors duration-300 ease-in-out hover:bg-red-700"
          >
            <svg className="h-[1em] w-[1em] invert">
              <image href="/close.svg" className="h-[1em] w-[1em]" />
            </svg>
          </button>
        </div>
        <div className="flex-1">{modalInfo?.gui && <modalInfo.gui />}</div>
      </div>
    </div>
  );
};
