export function FormatPositivity(score: number): string {
    let prefix = "";
    if(score > 0){
        prefix = "+";
    }
    else if(score < 0){
        prefix = "";
    }
    
    return prefix + score.toFixed(1);
}

export function GetPositivityLabel(score: number): "positive" | "negative" | "neutral" {
    if(score > 0){
        return "positive";
    }
    else if(score < 0){
        return "negative";
    }
    else{
        return "neutral";
    }
}