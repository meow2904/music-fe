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
}

export function ModalCustom({
    title = "Thông báo",
    description,
    children,
    onSave,
    saveLabel = "Tiếp tục",
    size = "md",
    footer,
    action
}: ModalCustomProps) {
    return (
        <Modal>
            <Button variant="outline">{action}</Button>
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
                                            className="flex-1 bg-primary text-white"
                                            onClick={onSave}
                                        >
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