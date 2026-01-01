document.addEventListener('DOMContentLoaded', function() {
    // Inject Chat Window HTML Structure
    const chatHTML = `
        <div class="chat-window" id="chatWindow">
            <div class="chat-header">
                <div class="chat-title">
                    <i class="fa-solid fa-robot"></i> Atendimento Virtual
                </div>
                <span class="chat-close" id="chatClose"><i class="fa-solid fa-xmark"></i></span>
            </div>
            <div class="chat-messages" id="chatMessages">
                <!-- Messages will appear here -->
            </div>
            <div class="chat-input-area">
                <input type="text" class="chat-input" id="chatInput" placeholder="Digite sua mensagem...">
                <button class="chat-send" id="chatSend"><i class="fa-solid fa-paper-plane"></i></button>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', chatHTML);

    // Elements
    const chatBtn = document.querySelector('.chatbot-float');
    const chatWindow = document.getElementById('chatWindow');
    const chatClose = document.getElementById('chatClose');
    const chatInput = document.getElementById('chatInput');
    const chatSend = document.getElementById('chatSend');
    const chatMessages = document.getElementById('chatMessages');

    let hasUserInteracted = false;

    // Toggle Chat Window
    if (chatBtn) {
        chatBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const isActive = chatWindow.classList.toggle('active');
            
            if (isActive) {
                // Focus input when opened
                setTimeout(() => chatInput.focus(), 100);

                // Show welcome message only if it's empty (first open)
                if (chatMessages.children.length === 0) {
                    setTimeout(() => {
                        addMessage('bot', 'Olá! Seja bem-vindo(a). Em que posso ajudar você hoje?');
                    }, 300);
                }
            }
        });
    }

    // Close Chat
    chatClose.addEventListener('click', () => {
        chatWindow.classList.remove('active');
    });

    // Send Message Logic
    function sendMessage() {
        const text = chatInput.value.trim();
        if (text) {
            // 1. Add User Message
            addMessage('user', text);
            chatInput.value = '';

            // 2. Check for first interaction
            if (!hasUserInteracted) {
                hasUserInteracted = true;
                
                // Simulate typing delay
                showTypingIndicator();
                
                setTimeout(() => {
                    removeTypingIndicator();
                    addMessage('bot', 'Obrigado pelo seu contato! Um de nossos atendentes entrará em contato em breve para te ajudar.');
                }, 1500);
            }
        }
    }

    // Event Listeners for Sending
    chatSend.addEventListener('click', sendMessage);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    // Helper: Add Message to UI
    function addMessage(sender, text) {
        const msgDiv = document.createElement('div');
        msgDiv.classList.add('message', sender);

        const messageContent = document.createElement('span');
        messageContent.classList.add('message-content');
        messageContent.innerHTML = text; // innerHTML to allow simple formatting if needed

        const timestamp = document.createElement('span');
        timestamp.classList.add('timestamp');
        const now = new Date();
        timestamp.innerText = now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0');

        msgDiv.appendChild(messageContent);
        msgDiv.appendChild(timestamp);
        
        chatMessages.appendChild(msgDiv);
        scrollToBottom();
    }

    // Helper: Scroll to bottom
    function scrollToBottom() {
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Optional: Typing indicator helper
    function showTypingIndicator() {
        const typingDiv = document.createElement('div');
        typingDiv.classList.add('message', 'bot', 'typing-indicator');
        typingDiv.id = 'typingIndicator';
        typingDiv.innerHTML = '<span>.</span><span>.</span><span>.</span>';
        chatMessages.appendChild(typingDiv);
        scrollToBottom();
    }

    function removeTypingIndicator() {
        const typingDiv = document.getElementById('typingIndicator');
        if (typingDiv) {
            typingDiv.remove();
        }
    }
});
