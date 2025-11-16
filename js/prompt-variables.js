(function () {
  function enhancePromptBlocks() {
    const promptBlocks = document.querySelectorAll('pre code.language-prompt');
    promptBlocks.forEach((codeBlock) => {
      const pre = codeBlock.parentElement;
      if (pre.classList.contains('prompt-copy-ready')) {
        return;
      }
      pre.classList.add('prompt-copy-ready');

      const button = document.createElement('button');
      button.className = 'prompt-copy-button';
      button.type = 'button';
      button.textContent = 'Copy';

      button.addEventListener('click', async () => {
        try {
          await navigator.clipboard.writeText(codeBlock.innerText.trim());
          const originalText = button.textContent;
          button.textContent = 'Copied!';
          button.disabled = true;
          setTimeout(() => {
            button.textContent = originalText;
            button.disabled = false;
          }, 2000);
        } catch (error) {
          console.error('Не удалось скопировать текст промпта', error);
        }
      });

      const wrapper = document.createElement('div');
      wrapper.className = 'prompt-copy-wrapper';
      pre.parentNode.insertBefore(wrapper, pre);
      wrapper.appendChild(pre);
      wrapper.appendChild(button);
    });
  }

  document.addEventListener('DOMContentLoaded', enhancePromptBlocks);
})();
