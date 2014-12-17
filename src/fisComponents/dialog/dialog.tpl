<div class="dialog-outer <%= className||'' %> position-<%= position %>">
    <% if(needClose){ %>
    <button class="dialog-close-button" aria-label="关闭"><i class="dialog-close"
                                                           data-active-target=".dialog-close-button"></i></button>
    <% } %>
    <h3 class="dialog-title border-bottom" style="text-align:<%= titleTextAlign %>"><i
                class="<%= icon %>"></i><%= title %></h3>

    <div class="dialog-content" style="text-align: <%= textAlign %>"><%= content %></div>
    <div class="dialog-btn-group border-top clearfix <%= cancel?'':'single' %>">
        <% if(cancel){ %>
        <button class="dialog-cancel-btn"><%= cancel %></button>
        <% } %>
        <button class="dialog-confirm-btn"><%= confirm %></button>
    </div>
</div>
<div class="dialog-bg"></div>
