import { useSnackbar } from 'notistack';

export function showSuccessMessage(message: string): void {
    const { enqueueSnackbar } = useSnackbar();
    enqueueSnackbar(message, {
        variant: 'success',
        anchorOrigin: {
            vertical: 'top',
            horizontal: 'right',
        },
    });
};

export function showErrorMessage(message: string, error: any): void {
    const { enqueueSnackbar } = useSnackbar();
    enqueueSnackbar(message, {
        variant: 'error',
        anchorOrigin: {
            vertical: 'top',
            horizontal: 'right',
        },
    });
    console.error('Error:' + error);
};

export function showUnexpectedErrorMessage(): void {
    const { enqueueSnackbar } = useSnackbar();
    enqueueSnackbar('An unexpected error occurred', {
        variant: 'error',
        anchorOrigin: {
            vertical: 'top',
            horizontal: 'right',
        },
    });
}