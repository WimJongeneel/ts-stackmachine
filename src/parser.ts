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
        } else {
            const [ label, argument ] = line.split(/\s+/, 2)
            
            if(argument == undefined) buffer.push({label: label as any, argument })
            else if(argument == 'true') buffer.push({label: label as any, argument: true })
            else if(argument == 'false') buffer.push({label: label as any, argument: false })
            else if(!Number.isNaN(Number(argument))) buffer.push({label: label as any, argument: Number(argument) })
            else buffer.push({label: label as any, argument: argument })
        }
    }
        code.set(current, buffer)
    return code
}