import { defineConfig } from 'prisma'

export default defineConfig({
    datasources: {
        db: {
            url: "file:./dev.db"
        }
    }
})
