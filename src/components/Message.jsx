import styles from "./Message.module.css";
import Button from "./Button";

function Message({ message, onClickHandler }) {
  return (
    <>
      <p className={styles.message}>
        <span role="img">👋</span> {message}
      </p>
      {onClickHandler && (
        <Button type="back" onClick={onClickHandler}>
          Clear
        </Button>
      )}
    </>
  );
}

export default Message;
