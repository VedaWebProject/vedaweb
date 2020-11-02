const queryRepresentation = (queryJSON, ui) =>
    ( queryJSON.mode === "grammar"
        ? "[" + queryJSON.blocks.map(b =>
            Object.keys(b).filter(k => k !== 'distance' && b[k] !== undefined && b[k] !== '')
                .map(k => k + ': ' + b[k]).join(', ')).join('] & [') + "]"
        : "\"" + queryJSON.input + "\""
    )
    +
    ( queryJSON.mode !== "grammar"
        ? " in " + ui.layers.find(l => l.id === queryJSON.field).label
        : ""
    )
    + " (search mode: " +
    (queryJSON.mode)
    + ")";

export default queryRepresentation;