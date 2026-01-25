export function AreYouSureDelete(callback: () => void) : void{
    if(confirm("Are you sure you want to delete this? This action cannot be undone.")){
        callback();
    }
}