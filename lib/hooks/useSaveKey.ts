import { useEffect } from "react";

export default function useSaveKey(submit: Function) {

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 's' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        submit()
      }
    }
    document.addEventListener('keydown', handleKeyDown, false);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return null;
}