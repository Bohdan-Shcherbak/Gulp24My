// видаляє папку
import {deleteAsync} from 'del';

export const reset = () => {
  return deleteAsync('./dist'); // зазвичай шлях до build/
};

export default reset;

