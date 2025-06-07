// file: config/drive.ts
import { join } from 'node:path'

export default {
  disk: 'local',
  disks: {
    local: {
      driver: 'local',
      visibility: 'public',
      root: join(process.cwd(), 'uploads'),
    },
  },
}
