import { code, heap, instructions, Reference, ReturnMarker, setInstructions, stack, StackValue } from "."
import { alloc, clear } from "./heap"

export const commands = {
    push: (v: StackValue) => {
        stack.push(v)
    },
    alloc: (v: StackValue) => {
        const a = v == undefined ? pop_number() : assertNumber(v)
        stack.push(alloc(a))
    },
    clear: (v: StackValue) => {
        const a =v == undefined ? pop_number() : assertNumber(v)
        clear(a)
    },
    h_assign: (_: StackValue) => {
        const value = pop()
        const offset = pop_number()
        const pointer = pop_number()
        heap[pointer+offset + 1] = value
    },
    h_read: (_: StackValue) => {
        const offset = pop_number()
        const pointer = pop_number()
        const value = heap[pointer+offset+1]
        if(typeof value == 'object') throw new Error("Cannot move object header to stack")
        stack.push(value)
    },
    add: (_: StackValue) => {
        const a = pop_number()
        const b = pop_number()
        stack.push(a + b)
    },
    decrease: (_: StackValue) => {
        const n = pop_number()
        stack.push(n - 1)
    },
    equals: (_: StackValue) => {
        const a = pop()
        const b = pop()
        stack.push(a === b)
    },
    invoke: (_: StackValue) => {
        const name = pop_ref()
        const argNumber = pop_number()
        // TODO: just insert ReturnMarker with offset?
        const args: StackValue[] = []
        for(let i = 0; i < argNumber; i++) args.push(stack.pop())
        stack.push(ReturnMarker)
        for(const a of args) stack.push(a)
        // push args by number
        setInstructions(code.get(name).concat(instructions))
    },
    return: (_: StackValue) => {
        // TODO clear remaining instructions from the code
        let r = stack.pop()
        let value = r
        while(value != ReturnMarker) value = stack.pop()
        if(r != ReturnMarker) stack.push(r)
    },
    if: (v: StackValue) => {
        const b = pop_bool()
        const l = v == undefined ? pop_ref() : assertReference(v)
        if(b) commands.jump(l)
    },
    jump: (v: StackValue) => {
        const name = v == undefined ? pop_ref() : assertReference(v)
        setInstructions(code.get(name))
    },
    print: (_: StackValue) => {
        const value = pop()
        console.log(value)
    },
    drop: (_: StackValue) => {
        pop()
    },
    duplicate: (_: StackValue) => {
        let last = pop()
        stack.push(last)
        stack.push(last)
    },
    swap: (_: StackValue) => {
        const a = pop()
        const b = pop()
        stack.push(a)
        stack.push(b)

    },
    not: (_: StackValue) => {
        const b = pop_bool()
        stack.push(!b)
    },
    debug: (_: StackValue) => {
        console.log(stack)
        console.log(heap)
    },
    local: (v: StackValue) => {
        const index = v == undefined ? pop_number() : assertNumber(v)
        const start = stack.lastIndexOf(ReturnMarker) + 1
        if(index > 0) stack.push(stack[start + index])
    }
}

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

const assertNumber = (v: StackValue) => {
    if(typeof v == 'number') return v
    throw new Error('Expected number, got ' + typeof v)
}

const assertReference = (v: StackValue) => {
    if(typeof v == 'string') return v
    throw new Error('Expected Reference, got ' + typeof v)
}