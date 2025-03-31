import { useOverlay, useModal, useDialog } from "@react-aria/overlays";
import { FocusScope } from "@react-aria/focus";
import { useRef } from "react";
import { motion } from "framer-motion";
import styles from "../styles/SymptomLogModal.module.css";

function SymptomLogModal({ isOpen, onClose, date }) {
  const ref = useRef();
  const { overlayProps, underlayProps } = useOverlay({ isOpen, onClose }, ref);
  const { modalProps } = useModal();
  const { dialogProps, titleProps } = useDialog({}, ref);

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={styles.underlay}
      {...underlayProps}
    >
      <FocusScope contain restoreFocus autoFocus>
        <div className={styles.modal} ref={ref} {...overlayProps} {...modalProps} {...dialogProps}>
          <h2 {...titleProps}>Log Symptoms for {date?.toDateString()}</h2>
          <form>
            <label>
              Symptom:
              <input type="text" />
            </label>
            <label>
              Severity (1-10):
              <input type="number" min="1" max="10" />
            </label>
            <button type="submit">Save</button>
            <button onClick={onClose}>Close</button>
          </form>
        </div>
      </FocusScope>
    </motion.div>
  );
}

export default SymptomLogModal;
