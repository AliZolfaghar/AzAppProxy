import  Handlebars from 'handlebars';
export default {        
        ifequal : ( a , b , options ) => {
            if (a == b) {
                return options.fn(this);  // Correct usage
            } else {
                return options.inverse(this);  // Handles the `{{else}}` block
            }        
        },
        ifnotequal : ( a , b , options ) => {
            if (a != b) {
                return options.fn(this);  // Correct usage
            } else {
                return options.inverse(this);  // Handles the `{{else}}` block
            }        
        },
        json : (obj) => {
            try {            
                return JSON.stringify(obj);
            } catch (error) {
                return error.message; 
            }
        },
        // create a block helper to show a card with a title and content
        card : (options) => {
            const title = options.hash.title || '';
            const className = options.hash.class || 'bg-white p-4 rounded shadow';
            const html = `
                <div class="card shadow ${className}">
                    <div class="card-header bg-primary text-white">
                        <span class="card-title text-capitalize display-5 bg-primary text-white">
                            ${title}
                        </span>
                    </div>
                    <div class="card-body">
                        ${options.fn(this)}
                    </div>
                </div>
            `;
            return new Handlebars.SafeString(html);
        } , 

    }