type Reference = string

const ReturnMarker = Symbol("ReturnMarker")

type StackValue =
    | number
    | boolean
    | Reference
    | typeof ReturnMarker

const stack: StackValue[] = []

type Instruction = 
    | { kind: 'push', value: StackValue }
    | { kind: 'command', name: keyof typeof commands }

const code = new Map<string, Instruction[]>()

let instructions: Instruction[] = []

const pop = () => {
    const peek = stack[stack.length -1]
    if(peek == ReturnMarker) throw new Error('Cannot pop ReturnMarker')
    return stack.pop()
}

const pop_number = (): number => {
    const value = pop()
    if(typeof value == 'number') return value
    throw new Error("Expected to pop a number, got: " + value.toString())
}

const pop_ref = (): Reference => {
    const value = pop()
    if(typeof value == 'string') return value
    throw new Error("Expected to pop a Reference, got: " + value.toString())
}

const pop_bool = (): boolean => {
    const value = pop()
    if(typeof value == 'boolean') return value
    throw new Error("Expected to pop a boolean, got: " + value.toString())
}

const commands = {
    add: () => {
        const a = pop_number()
        const b = pop_number()
        stack.push(a + b)
    },
    decrease: () => {
        const n = pop_number()
        stack.push(n - 1)
    },
    equals: () => {
        const a = pop()
        const b = pop()
        stack.push(a === b)

    },
    invoke: () => {
        const name = pop_ref()
        stack.push(ReturnMarker)
        instructions = code.get(name)
    },
    return: () => {
        let r = stack.pop()
        let value = r
        while(value != ReturnMarker) value = stack.pop()
        if(r != ReturnMarker) stack.push(r)
    },
    if: () => {
        const b = pop_bool()
        if(b) commands.jump()
        else pop_ref()
    },
    jump: () => {
        const name = pop_ref()
        instructions = [...code.get(name)]
    },
    print: () => {
        const value = pop()
        console.log(value)
    },
    drop: () => {
        pop()
    },
    duplicate: () => {
        let last = stack.pop()
        // check for multiple ReturnMarkers
        if(last == ReturnMarker) {
            last = stack.pop()
            stack.push(ReturnMarker)
        }
        stack.push(last)
        stack.push(last)
    },
    swap: () => {
        const a = pop()
        const b = pop()
        stack.push(a)
        stack.push(b)

    },
    not: () => {
        const b = pop_bool()
        stack.push(!b)
    },
    debug: () => {
        console.log(stack)
    }
}

const t =`
    .main
        push 1
        push 2
        add
        push 3
        equals
        push .if1
        swap
        if

    .if1
        push true
        push 3
        push .f1
        invoke
    
    .f1
        duplicate
        print
        push 88
        push 99
        push 33
        return

`

// 2 == 3 || 1 == 1

const tt = `
    .main
        push .b1true
        push 3
        push 3
        equals
        if

        push .b1true
        push 1
        push 2
        equals

        if
        push false
        push .cont
        jump

        
    .b1true
        push true
        push .cont
        jump

    .cont
        print
`

// 1 == 1 && 3 == 2

const ttt = `
    .main
        push .b1false
        push 1
        push 2
        equals
        not
        if

        push .b2true
        push 3
        push 3
        equals
        if

        push b3-false
        push .cont
        jump

    .b1false
        push b1-false
        push .cont
        jump

    .b2true
        push b2-true
        push .cont
        jump

    .cont
        print
`

const loop = `
    .main
        push 5
        push .loop
        jump
    
    .loop
        duplicate
        push 0
        equals
        push .cont
        swap
        if
        
        decrease
        push .loop
        jump

    .cont
        push done
        print
`

const run = () => {
    let i: Instruction;

    while(i = instructions.shift()) {
        if(i.kind == 'push') stack.push(i.value)
        if(i.kind == 'command') commands[i.name]()
    }
}

const load = (c: string) => {
    let current = ''
    let buffer: Instruction[] = []
    for(const line of c.split('\n').map(l => l.trim())) {
        if(line == '') continue

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
}

load(loop)
instructions = [...code.get('.main')]
run()

/**
 * TODO:
 *  - read from stack with safe ReturnMarker ignore:
 *      - first check if any value to be popped is a return marker
 *      - error if return marker would be swapped
 *      - pop values after check
 * 
 *  - more functions
 *  - test recursion
 *  - test jumps as loop mechanism
 *  - type safe reads, return and validate types in type-specific read functions
 *  - validate if return is from function (check if stack isn't empty in while-loop)
 *  - test return in if
 *  - test return in jump
 *  - test return after jump
 *  - test invoke, jump and if combinations
 *  - features: 
 *      - duplicate last N values
 *      - rotate values
 *      - declare constants
 */