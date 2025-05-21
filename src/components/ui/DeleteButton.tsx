import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  type ButtonProps,
} from "@heroui/react";

export default function DeleteButton({
  onDelete,
  title,
  description,
  ...props
}: {
  onDelete: () => void;
  title: string;
  description: string;
} & ButtonProps) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <>
      <Button
        {...props}
        onPress={onOpen}
        color="danger"
        variant="ghost"
        size={props.size ? props.size : "sm"}
        className="text-rose-400 dark:text-rose-300 hover:text-rose-500 dark:hover:text-rose-400 border-none"
      >
        删除
      </Button>
      <Modal
        isDismissable={false}
        isKeyboardDismissDisabled={true}
        isOpen={isOpen}
        onOpenChange={onOpenChange}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">{title}</ModalHeader>
              <ModalBody>
                <p>{description}</p>
              </ModalBody>
              <ModalFooter>
                <Button color="default" variant="light" onPress={onClose}>
                  取消
                </Button>
                <Button
                  color="danger"
                  onPress={onDelete}
                  className="bg-rose-400 hover:bg-rose-500"
                >
                  确认
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
