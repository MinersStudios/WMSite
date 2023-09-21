self.onmessage = async (event) => {
    const screenshots = event.data

    await Promise.all(
        screenshots.map(async (screenshot) => {
            const imageURL = `./img/screenshots/${screenshot}.webp`

            try {
                const response = await fetch(imageURL)

                if (!response.ok) {
                    console.error(`Failed to load image: ${imageURL}`)
                    return
                }

                self.postMessage({
                    screenshot,
                    image: await createImageBitmap(await response.blob())
                })
            } catch (error) {
                console.error(error)
            }
        })
    )
}
