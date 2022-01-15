import { commands } from "./commands"
import { init_heap } from "./heap"
import { parse } from "./parser"

export type Reference = string
export type Pointer = number

export const ReturnMarker = Symbol("ReturnMarker")

export type StackValue =
    | number
    | boolean
    | Reference
    | typeof ReturnMarker
    | Pointer

export const stack: StackValue[] = []

export interface Instruction {
    label: keyof typeof commands
    argument: StackValue
}

export let programCounter = -1

export let instructions: Instruction[] = []

export const setProgramCounter = (pc: number) => {
    programCounter = pc
}

export const exit = () => programCounter = Infinity

export interface ObjectHeader {
    size: number
}

export const heap: Array<StackValue | ObjectHeader> = []

// 2 == 3 || 1 == 1
const tt = `
    push .b1true
    push 3
    push 3
    equals
    if 

    push 1
    push 1
    equals 
    if .b1true

    push false
    jump .cont
        
    .b1true
        push true
        jump .cont

    .cont
        print
`

// 1 == 1 && 3 == 2

const ttt = `
    .main
        push .b1false
        push 2
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

        duplicate
        print
        
        decrease
        push 
        jump .loop

    .cont
        push done
        print
`

const m = `
    .main
        push 3
        alloc

        push 2
        alloc

        # b[0] = 'a2'
        duplicate
        push 0
        push a2
        h_assign

        duplicate
        push 0
        h_read
        print

        drop

        duplicate
        push 0
        push aa
        h_assign

        duplicate
        push 2
        push cc
        h_assign

        debug

`

const run = () => {
    while(programCounter < instructions.length - 1) {
        programCounter++
        const i = instructions[programCounter]
        console.log(programCounter, i)
        commands[i.label](i.argument)
    }
}

instructions = parse(tt)
console.log(instructions.map((l ,i) => [i, l]))
init_heap(0)
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