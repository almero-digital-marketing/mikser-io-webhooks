export default function (options = {}) {
    const { url, token, logger = console } = options
    if (!url) {
        logger.warn('Mikser web hooks url is missing')
        return
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
            const hookUrl = `${url}/webhooks`
            try {
                logger.info('Mikser web hooks trigger: %s %s', hookUrl, uri)
                const response = await fetch(hookUrl, {
                    method: 'POST',
                    headers,
                    body: JSON.stringify({ uri })
                })
                const result = await response.json()
                if (!result.success) {
                    logger.error('Mikser web hooks trigger error: %s %s %s', hookUrl, uri, result.message)
                }
            } catch (err) {
                logger.error('Mikser web hooks trigger error: %s %s %s', hookUrl, uri, err.message)
            }
        },
        async created(name, entity) {
            const hookUrl = `${url}/webhooks/${name}`
            try {
                logger.info('Mikser web hooks created: %s %s', hookUrl, entity.id)
                const response = await fetch(hookUrl, {
                    method: 'POST',
                    headers,
                    body: JSON.stringify(entity)
                })
                const result = await response.json()
                if (!result.success) {
                    logger.error('Mikser web hooks created error: %s %s %s', hookUrl, entity.id, result.message)
                }
            } catch (err) {
                logger.error('Mikser web hooks created error: %s %s %s', hookUrl, entity.id, err.message)
            }
        },
        async updated(name, entity) {
            const hookUrl = `${url}/webhooks/${name}`
            try {
                logger.info('Mikser web hooks updated: %s %s', hookUrl, entity.id)
                const response = await fetch(hookUrl, {
                    method: 'PUT',
                    headers,
                    body: JSON.stringify(entity)
                })
                const result = await response.json()
                if (!result.success) {
                    logger.error('Mikser web hooks updated error: %s %s %s', hookUrl, entity.id, result.message)
                }
            } catch (err) {
                logger.error('Mikser web hooks updated error: %s %s %s', hookUrl, entity.id, err.message)
            }
        },
        async deleted(name, entity) {
            const hookUrl = `${url}/webhooks/${name}`
            try {
                logger.info('Mikser web hooks deleted: %s %s', hookUrl, entity.id)
                const response = await fetch(hookUrl, {
                    method: 'DELETE',
                    headers,
                    body: JSON.stringify(entity)
                })
                const result = await response.json()
                if (!result.success) {
                    logger.error('Mikser web hooks deleted error: %s %s %s', hookUrl, entity.id, result.message)
                }
            } catch (err) {
                logger.error('Mikser web hooks deleted error: %s %s %s', hookUrl, entity.id, err.message)
            }
        }
    }
}