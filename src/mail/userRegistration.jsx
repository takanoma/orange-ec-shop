export const userRegistrationTitle = "【Orangeショッピングサイト】仮登録のお知らせ"
export const userRegistrationBody = (mailAddress, url) => {
    return `
${mailAddress} 様
    
Orangeショッピンサイトです。
ユーザーの仮登録が完了しました。
    
下記URLをクリックし、本登録を完了してください。
${url}
※上記URLの有効期限は24時間です。
有効期限が過ぎると、このURLから会員登録のお手続きが
出来なくなりますので、ご注意ください。

なお、このメールに心当たりのない方は
Orangeショッピングカスタマーデスクにお問い合わせください。
  
--
Orangeショッピングサイト
`
}


