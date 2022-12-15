function overview(invoices=[], add=0){
    var pn = 0 + add
    var an = 0
    var cn = 0

    const pending = invoices.find((i)=>{

        if(i.financed == 0 && i.approved_by_seller != 2){
            pn++
        }
    }
    )
    const active = invoices.find((i)=>{
        if(i.financed == 1 && i.closed == 0){
            an++
        }
    }
    )
    const completed = invoices.find((i)=>{

        if(i.closed == 1){
            cn++
        }
    }
        )
    return {pending:pn, active:an, completed:cn}
    // console.log([pending].length, [active], [completed])

}

export default overview