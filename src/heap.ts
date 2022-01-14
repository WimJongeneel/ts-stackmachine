import { heap, Pointer } from "."

export const init_heap = (heapSize: number) => {
    for(let i = 0; i < heapSize; i++) heap[i] = undefined
}

export const alloc = (size: number): Pointer => {
    let current = 0
    while(true) {
        const value = heap[current]
        if(typeof value == 'object') current += value.size + 1
        else {
            let fits = true
            for(let i = 0; i < size + 1; i++) if(heap[current+i] != undefined) fits = false
            if(fits) {
                heap[current] = { size }
                return current
            } else {
                current++
            }
        }

        if(current > heap.length) throw new Error("OOM")
    }
}

export const clear = (p: Pointer) => {
    let header = heap[p]
    while(typeof header == 'number') header = heap[header]
    if(typeof header == 'object' && 'size' in header) 
        for(let i = 0; i < header.size + 1; i++) heap[i] = undefined
    else throw new Error("pointer doesn't point to object header")
}

export const gc_collect = () => {
    // get references from stack
    // expand references from heap
    // prevent circular loops
    // clear unreachable objects
}