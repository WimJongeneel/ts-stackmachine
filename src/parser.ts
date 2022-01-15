import { Instruction } from "."

export const parse = (c: string): Instruction[] => {
    const lines = c.split('\n')
        .map(l => l.trim())
        .filter(l => l != '')
        .filter(l => !l.startsWith('#'))

    const labels = new Map<string, number>()
    const result: Instruction[] = []

    for(let i = 0; i < lines.length; i++) {
        const line = lines[i]

        if(line.startsWith('.')) {
            labels.set(line, result.length)
        } else {
            const [ label, argument ] = line.split(/\s+/, 2)
            
            if(argument == undefined) result.push({label: label as any, argument })
            else if(argument == 'true') result.push({label: label as any, argument: true })
            else if(argument == 'false') result.push({label: label as any, argument: false })
            else if(!Number.isNaN(Number(argument))) result.push({label: label as any, argument: Number(argument) })
            else result.push({label: label as any, argument: argument })
        }
    }

    for(const i of result) if(typeof i.argument == 'string' && i.argument.startsWith('.')) i.argument = labels.get(i.argument) - 1

    return result
}