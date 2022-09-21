<script>
    export let message;

    $: messageDate = message.time?.toDate()?.toLocaleTimeString('sv-SE');
</script>
<div class="wrapper">
   <div class="message">
        {message.message}
   </div>
   <div class="user">
        {message.name} / {messageDate ? messageDate : 'Sending...'}
   </div>
</div>

<style>
    .wrapper {
        max-width: 500px;
        margin-left: auto;
        margin-right: auto;
        border-radius: 10px;
        color: white;
        background-color: royalblue;
        margin-bottom: 10px;
        padding: 10px;
    }

    .user {
        text-align: right;
        font-weight: bold;
    }
</style>