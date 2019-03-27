walk(document.body);

function walk(node) {
    // Original Source http://is.gd/mwZp7E
    // With fix from github:kmatt

	var child, next;

	if (node.nodeName.toLowerCase() == 'input' || node.nodeName.toLowerCase() == 'textarea' || (node.classList && node.classList.contains('ace_editor'))) { return; }

	switch ( node.nodeType ) {
		case 1:  // Element
		case 9:  // Document
		case 11: // Document fragment
			child = node.firstChild;
			while ( child )
			{
				next = child.nextSibling;
				walk(child);
				child = next;
			}
			break;

		case 3: // Text node
			handleText(node);
			break;
	}
}

function matchCase(text, pattern) {
    // Case preservation courtesy of stackoverflow:Ry-♦
    var result = '';

    for(var i = 0; i < text.length; i++) {
        var c = text.charAt(i);
        var p = pattern.charCodeAt(i);

        if(p >= 65 && p < 65 + 26) {
            result += c.toUpperCase();
        } else {
            result += c.toLowerCase();
        }
    }

    return result;
}

function handleText(textNode) {
	chrome.storage.sync.get({
		replaceAccident: true,
		replaceSudden:   true,
		replaceLego:     true,
		markChanged:     true
	}, function (items) {
		var s = textNode.parentElement.innerHTML;
		var pre, post;

		if (items.markChanged) {
			pre = '<span style="border-bottom: 1px dotted gray;">';
			post = '</span>';
		} else {
			pre = '<span>';
			post = '</span>';
		}

		if (items.replaceAccident) {
			var accidentRegEx = new RegExp('\\b' + 'on accident' + '\\b', 'gi');

			s = s.replace(accidentRegEx, function(match) {
				return pre + matchCase("by accident", match) + post;
			});
		}

		if (items.replaceSudden) {
			var suddenRegEx = new RegExp('\\b' + 'all of the sudden' + '\\b', 'gi');

			s = s.replace(suddenRegEx, function(match) {
				return pre + matchCase("all of a sudden", match) + post;
			});
		}

		if (items.replaceLego) {
			var legoRegEx = new RegExp('\\b' + 'legos' + '\\b', 'gi');
			var replacementString = pre + 'LEGO' + post;
			s = s.replace(legoRegEx, replacementString);
		}
		textNode.parentElement.innerHTML = s;
	});
}
