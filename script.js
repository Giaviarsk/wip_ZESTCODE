// script.js
document.addEventListener('DOMContentLoaded', function() {
    const workspace = document.querySelector('.workspace');
    const sidebar = document.querySelector('.sidebar');

    document.querySelectorAll('.block').forEach(block => {
        block.addEventListener('dragstart', handleDragStart);
        block.dataset.type = block.id.includes('printBlock') ? 'print' : block.id.includes('textStyleBlock') ? 'text-style' : 'other';
    });

    workspace.addEventListener('dragover', allowDrop);
    workspace.addEventListener('drop', handleDrop);
    sidebar.addEventListener('dragover', allowDrop);
    sidebar.addEventListener('drop', handleDropBack);

    function allowDrop(ev) {
        ev.preventDefault();
    }

    function handleDragStart(ev) {
        ev.dataTransfer.setData("text", ev.target.id);
        ev.dataTransfer.setData("type", ev.target.dataset.type);
    }

    function handleDrop(ev) {
        ev.preventDefault();
        var data = ev.dataTransfer.getData("text");
        var type = ev.dataTransfer.getData("type");
        var target = ev.target.closest('.block') || workspace;

        if (!target.classList.contains('workspace') && !target.classList.contains('block')) {
            return; // Prevent dropping outside valid areas
        }

        var originalBlock = document.getElementById(data);
        if (!originalBlock) return; // No original block found

        var nodeCopy = originalBlock.cloneNode(true); // Clone with all children
        nodeCopy.id = `block${Math.random()}`; // New unique ID
        nodeCopy.dataset.type = originalBlock.dataset.type;
        nodeCopy.draggable = true;
        nodeCopy.addEventListener('dragstart', handleDragStart);

        if (type === 'text-style' && target.dataset.type === 'print') {
            target.appendChild(nodeCopy); // Append to 'print-block'
            setupTextStyle(target, nodeCopy.querySelector('.style-select'));
        } else {
            workspace.appendChild(nodeCopy); // Append to workspace directly
        }
    }

    function handleDropBack(ev) {
        ev.preventDefault();
        var data = ev.dataTransfer.getData("text");
        var block = document.getElementById(data);
        if (block && block.parentNode === workspace) {
            workspace.removeChild(block);
        }
    }

    function runPrintBlock() {
        const inputs = document.querySelectorAll(".workspace .printInput");
        let styledText = "";
    
        inputs.forEach(input => {
            if (input.value.trim() !== "") {
                const style = window.getComputedStyle(input);
                const fontSize = style.fontSize;
                const fontWeight = style.fontWeight;
                const fontStyle = style.fontStyle;
                const textDecoration = style.textDecoration;
    
                styledText += `<p style='font-size: ${fontSize}; font-weight: ${fontWeight}; font-style: ${fontStyle}; text-decoration: ${textDecoration};'>${input.value}</p>`;
            }
        });
    
        const newWindow = window.open("", "_blank", "width=400,height=200");
        newWindow.document.write(styledText);
        newWindow.document.close();
    }    

    function setupTextStyle(printBlock, selectElement) {
        selectElement.addEventListener('change', function() {
            applyTextStyle(printBlock, this.value);
        });
        applyTextStyle(printBlock, selectElement.value);
    }

    function applyTextStyle(printBlock, style) {
        const textInput = printBlock.querySelector('.printInput');
        textInput.style = ""; // Clear previous styles
        switch (style) {
            case 'h1':
                textInput.style.fontSize = '32px';
                textInput.style.fontWeight = 'bold';
                break;
            case 'h2':
                textInput.style.fontSize = '24px';
                textInput.style.fontWeight = 'bold';
                break;
            case 'p':
                textInput.style.fontSize = '16px';
                break;
            case 'h3':
                textInput.style.fontSize = '18px';
                textInput.style.fontWeight = 'bold';
                break;
            case 'h4':
                textInput.style.fontSize = '14px';
                textInput.style.fontStyle = 'italic';
                break;
            default:
                textInput.style.fontSize = '16px';
                break;
        }
    }

    // Adding runPrintBlock as a globally accessible function
    window.runPrintBlock = runPrintBlock;
});
