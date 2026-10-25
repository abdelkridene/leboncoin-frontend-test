import styles from './CutCableIllustration.module.css'

export const CutCableIllustration = () => (
  <svg
    aria-hidden="true"
    focusable="false"
    className={styles.illustration}
    viewBox="0 0 200 96"
    width="200"
    height="96"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path className={styles.cable} d="M4 76C36 76 40 48 70 48" strokeLinecap="butt" />
    <path className={styles.cable} d="M196 20C164 20 160 48 130 48" strokeLinecap="butt" />
    <ellipse className={styles.cut} cx="70" cy="48" rx="2.5" ry="6" />
    <ellipse className={styles.cut} cx="130" cy="48" rx="2.5" ry="6" />

    <path className={styles.wireOrange} d="M70 44c5-1 10-5 13-9" />
    <path className={styles.wireBlue} d="M70 48c6 0 11 1 15 3" />
    <path className={styles.wireGreen} d="M70 52c4 2 8 6 10 11" />
    <path className={styles.wireOrange} d="M130 44c-5-2-9-6-11-10" />
    <path className={styles.wireBlue} d="M130 48c-6 0-11-1-15-3" />
    <path className={styles.wireGreen} d="M130 52c-5 1-9 5-12 9" />

    <path className={styles.spark} d="M105 28l-9 19h10l-9 21" />
    <path className={styles.spark} d="M88 22l-4-5M112 22l4-5M88 74l-4 5M112 74l4 5" />
  </svg>
)
