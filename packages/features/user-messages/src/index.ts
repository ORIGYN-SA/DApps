import { useSnackbar } from 'notistack';

export function useUserMessages() {
  const { enqueueSnackbar } = useSnackbar();

  function showSuccessMessage(message: string): void {
    enqueueSnackbar(message, {
      variant: 'success',
      anchorOrigin: {
        vertical: 'top',
        horizontal: 'right',
      },
    });
    console.log('Showed user success message: ' + message);
  }

  function showErrorMessage(message: string, error: any): void {
    enqueueSnackbar(message, {
      variant: 'error',
      anchorOrigin: {
        vertical: 'top',
        horizontal: 'right',
      },
    });
    console.log('Showed error message: ' + message);
    console.error(error);
  }

  function showUnexpectedErrorMessage(error: any): void {
    enqueueSnackbar('An unexpected error occurred', {
      variant: 'error',
      anchorOrigin: {
        vertical: 'top',
        horizontal: 'right',
      },
    });
    console.log('Showed unexpected error');
    console.error(error);
  }

  return { showSuccessMessage, showErrorMessage, showUnexpectedErrorMessage };
}
