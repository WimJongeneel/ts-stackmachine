import { Instruction } from "."

export const parse = (c: string): Map<string, Instruction[]> => {
    let current = ''
    let buffer: Instruction[] = []
    const code = new Map<string, Instruction[]>()
    for(const line of c.split('\n').map(l => l.trim())) {
        if(line == '') continue
        if(line.startsWith('#')) continue

        if(line.startsWith('.')) {
            code.set(current, buffer)
            current = line
            buffer = []
        }
        else if(line.startsWith('push ')) {
            const value = line.replace('push ', '')
            if(value == 'true') buffer.push({ kind: 'push', value: true })
            else if(value == 'false') buffer.push({ kind: 'push', value: true })
            else if(!Number.isNaN(Number(value))) buffer.push({ kind: 'push', value: Number(value) })
            else buffer.push({ kind: 'push', value: value })
        } else {
            buffer.push({ kind: 'command', name: line as any})
        }
    }
    code.set(current, buffer)
    return code
}