export interface CustomAlertProps {
  visible: boolean;
  title: string;
  message: string;
  onClose: () => void;
}