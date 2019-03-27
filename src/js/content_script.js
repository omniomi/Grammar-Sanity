var accidentRegEx = new RegExp('\\b' + 'on accident' + '\\b', 'gi');
var suddenRegEx = new RegExp('\\b' + 'all of the sudden' + '\\b', 'gi');
var legoRegEx = new RegExp('\\b' + 'legos' + '\\b', 'gi');

function walk(node) {
	// Original Source http://is.gd/mwZp7E
	// With fix from github:kmatt

	var child, next;

	if (node.nodeName.toLowerCase() == 'input' || node.nodeName.toLowerCase() == 'textarea' || (node.classList && node.classList.contains('ace_editor'))) {
		return;
	}

	switch (node.nodeType) {
		case 1:  // Element
		case 9:  // Document
		case 11: // Document fragment
			child = node.firstChild;
			while (child) {
				next = child.nextSibling;
				walk(child);
				child = next;
			}
			break;

		case 3: // Text node
			if (node.textContent.match(accidentRegEx) || node.textContent.match(suddenRegEx) || node.textContent.match(legoRegEx)) {
				handleText(node);
			}
			break;
	}
}

function matchCase(text, pattern) {
	// Case preservation courtesy of stackoverflow:Ry-♦
	var result = '';

	for (var i = 0; i < text.length; i++) {
		var c = text.charAt(i);
		var p = pattern.charCodeAt(i);

		if (p >= 65 && p < 65 + 26) {
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
		replaceSudden: true,
		replaceLego: true,
		markChanged: true
	}, function (items) {
		var s = textNode.parentElement.innerHTML;

		var pre;
		var post = '</span>';

		if (items.markChanged) {
			pre = '<span style="border-bottom: 1px dotted gray;">';
		} else {
			pre = '<span>';
		}

		if (items.replaceAccident && s.match(accidentRegEx)) {
			textNode.parentElement.innerHTML = s.replace(accidentRegEx, function (match) {
				return pre + matchCase("by accident", match) + post;
			});
		}

		if (items.replaceSudden && s.match(suddenRegEx)) {
			textNode.parentElement.innerHTML = s.replace(suddenRegEx, function (match) {
				return pre + matchCase("all of a sudden", match) + post;
			});
		}

		if (items.replaceLego && s.match(legoRegEx)) {
			var replacementString = pre + 'LEGO' + post;
			textNode.parentElement.innerHTML = s.replace(legoRegEx, replacementString);
		}
	});
}

walk(document.body);

new MutationObserver(function () {
	walk(document.body);
}).observe(document.body, {
	childList: true
});
