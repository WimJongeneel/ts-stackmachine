import { code, heap, Reference, ReturnMarker, setInstructions, stack, StackValue } from "."
import { alloc, clear } from "./heap"

export const commands = {
    alloc: () => {
        const a = pop_number()
        stack.push(alloc(a))
    },
    clear: () => {
        const a = pop_number()
        clear(a)
    },
    h_assign: () => {
        const value = pop()
        const offset = pop_number()
        const pointer = pop_number()
        heap[pointer+offset + 1] = value
    },
    h_read: () => {
        const offset = pop_number()
        const pointer = pop_number()
        const value = heap[pointer+offset+1]
        if(typeof value == 'object') throw new Error("Cannot move object header to stack")
        stack.push(value)
    },
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
        const argNumber = pop_number()
        // TODO: just insert ReturnMarker with offset?
        const args: StackValue[] = []
        for(let i = 0; i < argNumber; i++) args.push(stack.pop())
        stack.push(ReturnMarker)
        for(const a in args) stack.push(a)
        // push args by number
        setInstructions(code.get(name))
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
        setInstructions(code.get(name))
    },
    print: () => {
        const value = pop()
        console.log(value)
    },
    drop: () => {
        pop()
    },
    duplicate: () => {
        let last = pop()
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
        console.log(heap)
    },
    local: () => {
        const index = pop_number()
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