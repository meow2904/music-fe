"use client";

import { Button, Modal, ModalProps } from "@heroui/react";
import { ReactNode } from "react";

export interface ModalCustomProps {
    title?: string;
    description?: ReactNode; // Có thể là chuỗi hoặc component
    children?: ReactNode;    // Nội dung chính của Modal
    footer?: ReactNode;      // Tùy chỉnh footer nếu cần
    onSave?: () => void;
    saveLabel?: string;
    closeLabel?: string;
    size?: "xs" | "sm" | "md" | "lg" | "xl" | "full";
    action?: ReactNode;
    onOpen?: () => void;
    isLoading?: boolean;
}

export function ModalCustom({
    title = "Thông báo",
    description,
    children,
    onSave,
    saveLabel = "Tiếp tục",
    size = "md",
    footer,
    action,
    onOpen,
    isLoading
}: ModalCustomProps) {
    return (
        <Modal>
            <Button variant="outline" onClick={onOpen}>{action}</Button>
            <Modal.Backdrop>
                <Modal.Container>
                    <Modal.Dialog className="sm:max-w-[450px]">
                        <Modal.CloseTrigger />

                        <Modal.Header>
                            <Modal.Heading>{title}</Modal.Heading>
                        </Modal.Header>

                        <Modal.Body>
                            {description && (
                                <p className="text-sm text-zinc-500 mb-4">{description}</p>
                            )}
                            {children}
                        </Modal.Body>

                        <Modal.Footer>
                            {footer ? footer : (
                                <div className="flex justify-end gap-2">
                                    {onSave && (
                                        <Button
                                            className="flex-1 bg-primary text-white flex items-center justify-center gap-2"
                                            onClick={onSave}
                                            isDisabled={isLoading}
                                            data-loading={isLoading}
                                        >
                                            {isLoading && (
                                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                            )}
                                            {saveLabel}
                                        </Button>
                                    )}
                                </div>
                            )}
                        </Modal.Footer>
                    </Modal.Dialog>
                </Modal.Container>
            </Modal.Backdrop>
        </Modal>
    );
}