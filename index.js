import Queue from 'queue'

export default function (options = {}) {
    const { url, token, logger = console } = options
    let queue = Queue({
        concurrency: 4,
        autostart: true
    })

    if (!url) {
        logger.warn('Mikser web hooks url is missing')
        return {
            trigger() {},
            created() {},
            updated() {},
            deleted() {},
        }
    }
    logger.info('Mikser web hooks initalized: %s', url)

    const headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    }
    if (token) {
        headers['Authorization'] = `Bearer ${token}`
    }

    return {
        async trigger(uri) {
            queue.push(async () => {
                const hookUrl = `${url}/mikser/webhooks`
                try {
                    logger.info('Mikser web hooks trigger: %s', uri)
                    const response = await fetch(hookUrl, {
                        method: 'POST',
                        headers,
                        body: JSON.stringify({ uri })
                    })
                    const result = await response.json()
                    if (!result.success) {
                        logger.error('Mikser web hooks trigger error: [%s] %s %s', hookUrl, uri, result.message)
                    }
                } catch (err) {
                    logger.error('Mikser web hooks trigger error: [%s] %s %s', hookUrl, uri, err.message)
                }
            })
        },
        async created(name, entity) {
            queue.push(async () => {
                const hookUrl = `${url}/mikser/webhooks/${name}`
                try {
                    logger.info('Mikser web hooks created: %s %s', name, entity.id)
                    const response = await fetch(hookUrl, {
                        method: 'POST',
                        headers,
                        body: JSON.stringify(entity)
                    })
                    const result = await response.json()
                    if (!result.success) {
                        logger.error('Mikser web hooks created error: %s %s %s', name, entity.id, result.message)
                    }
                } catch (err) {
                    logger.error('Mikser web hooks created error: %s %s %s', name, entity.id, err.message)
                }
            })
        },
        async updated(name, entity) {
            queue.push(async () => {
                const hookUrl = `${url}/mikser/webhooks/${name}`
                try {
                    logger.info('Mikser web hooks updated: %s %s', name, entity.id)
                    const response = await fetch(hookUrl, {
                        method: 'PUT',
                        headers,
                        body: JSON.stringify(entity)
                    })
                    const result = await response.json()
                    if (!result.success) {
                        logger.error('Mikser web hooks updated error: %s %s %s', name, entity.id, result.message)
                    }
                } catch (err) {
                    logger.error('Mikser web hooks updated error: %s %s %s', name, entity.id, err.message)
                }
            })
        },
        async deleted(name, entity) {
            queue.push(async () => {
                const hookUrl = `${url}/mikser/webhooks/${name}`
                try {
                    logger.info('Mikser web hooks deleted: %s %s', name, entity.id)
                    const response = await fetch(hookUrl, {
                        method: 'DELETE',
                        headers,
                        body: JSON.stringify(entity)
                    })
                    const result = await response.json()
                    if (!result.success) {
                        logger.error('Mikser web hooks deleted error: %s %s %s', name, entity.id, result.message)
                    }
                } catch (err) {
                    logger.error('Mikser web hooks deleted error: %s %s %s', name, entity.id, err.message)
                }
            })
        }
    }
}