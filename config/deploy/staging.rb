set :stage, :staging
set :branch, 'dev'

# Simple Role Syntax
# ==================
#role :app, %w{cacho@54.93.72.133}
#role :web, %w{cacho@54.93.72.133}
#role :db,  %w{cacho@54.93.72.133}

# Extended Server Syntax
# ======================
server 'easehub.online', user: 'deploy', roles: %w{web app db}

# you can set custom ssh options
# it's possible to pass any option but you need to keep in mind that net/ssh understand limited list of options
# you can see them in [net/ssh documentation](http://net-ssh.github.io/net-ssh/classes/Net/SSH.html#method-c-start)
# set it globally
#  set :ssh_options, {
#    keys: %w(~/.ssh/id_rsa),
#    forward_agent: false,
#    auth_methods: %w(password)
#  }

fetch(:default_env).merge!(wp_env: :staging)