
let navigate: ((path: string) => void) | null = null;

export const setNavigate = (navFunc: (path: string) => void) => {
  navigate = navFunc;
};

export const redirect = (path: string) => {
  if (navigate) {
    navigate(path);
  } else {
    console.error('Navigate function is not set');
  }
};
