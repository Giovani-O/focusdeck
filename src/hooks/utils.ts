// ////////////////////////////////////////////////
// Utility hooks //////////////////////////////////
// ////////////////////////////////////////////////

/**
 *
 * @param seconds The number of seconds.
 * @returns The number of minutes.
 */
export const toMinutes = (seconds: number): number => {
  return Math.round(seconds / 60);
};

/**
 *
 * @param minutes The number of minutes.
 * @returns The number of seconds.
 */
export const toSeconds = (minutes: number): number => {
  return Math.round(minutes * 60);
};

/**
 *
 * @param e The input event
 */
export const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
  if (
    !/[0-9]/.test(e.key) &&
    ![
      "Backspace",
      "Delete",
      "ArrowLeft",
      "ArrowRight",
      "Tab",
      "End",
      "Home",
    ].includes(e.key)
  ) {
    e.preventDefault();
  }
};
