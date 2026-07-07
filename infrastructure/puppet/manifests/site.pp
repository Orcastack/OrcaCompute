# Puppet site manifest for OrcaCompute Platform
# Main entry point for Puppet configuration

# Global defaults
Exec {
  path => ['/usr/local/bin', '/usr/bin', '/bin', '/usr/local/sbin', '/usr/sbin', '/sbin'],
}

# Node classifications
node default {
  include orcacompute::platform
  include orcacompute::security
  include orcacompute::monitoring
}

# Development environment nodes
node /^dev-.*/ {
  $environment = 'development'
  include orcacompute::platform
  include orcacompute::security
  
  # Development-specific configurations
  class { 'orcacompute::platform':
    debug_mode => true,
    log_level  => 'debug',
  }
}

# Production environment nodes
node /^prod-.*/ {
  $environment = 'production'
  include orcacompute::platform
  include orcacompute::security
  include orcacompute::monitoring
  
  # Production-specific configurations
  class { 'orcacompute::platform':
    debug_mode       => false,
    log_level        => 'warning',
    enable_ssl       => true,
    backup_enabled   => true,
  }
}

# Staging environment nodes
node /^staging-.*/ {
  $environment = 'staging'
  include orcacompute::platform
  include orcacompute::security
  
  class { 'orcacompute::platform':
    debug_mode => false,
    log_level  => 'info',
    enable_ssl => true,
  }
}