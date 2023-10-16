let toastsContainer = document.querySelector('.toasts')

if (!toastsContainer) {
    toastsContainer = document.createElement('div')

    toastsContainer.classList.add('toasts')
    document.body.appendChild(toastsContainer)
}

export const ToastType = {
    INFO: 'info',
    SUCCESS: 'success',
    ERROR: 'error',
    WARNING: 'warning'
};

export function showToast(
    text,
    color = ToastType.INFO
) {
    if (typeof text !== 'string') {
        throw new Error('Toast text must be a string')
    }

    if (!Object.values(ToastType).includes(color)) {
        throw new Error('Toast color must be a valid ToastType')
    }

    const toast = document.createElement('div')

    toast.classList.add('toast', 'transitionIn', 'transitionOut', color)
    toast.textContent = text
    toastsContainer.appendChild(toast)

    setTimeout(() => {
        toastsContainer.removeChild(toast)
    }, 3500)
}
