# OrcaCompute Platform main module
# Manages the core platform deployment and configuration

class orcacompute::platform (
  Boolean $debug_mode = false,
  String $log_level = 'info',
  Boolean $enable_ssl = false,
  Boolean $backup_enabled = false,
  String $platform_version = 'latest',
  String $database_password = 'atonixpass',
  Hash $environment_vars = {},
) {

  # Ensure required packages are installed
  ensure_packages([
    'docker.io',
    'docker-compose',
    'git',
    'curl',
    'wget',
    'unzip',
  ])

  # Create platform user
  user { 'orcacompute':
    ensure     => present,
    home       => '/opt/orcacompute',
    shell      => '/bin/bash',
    managehome => true,
    system     => true,
  }

  # Create platform directories
  file { ['/opt/orcacompute', '/opt/orcacompute/platform', '/opt/orcacompute/logs', '/opt/orcacompute/data']:
    ensure  => directory,
    owner   => 'orcacompute',
    group   => 'orcacompute',
    mode    => '0755',
    require => User['orcacompute'],
  }

  # Deploy platform repository
  vcsrepo { '/opt/orcacompute/platform':
    ensure   => present,
    provider => git,
    source   => 'https://github.com/atonixdev/orcacompute-platform.git',
    user     => 'orcacompute',
    require  => [User['orcacompute'], File['/opt/orcacompute/platform']],
  }

  # Platform environment configuration
  file { '/opt/orcacompute/platform/.env':
    ensure  => file,
    owner   => 'orcacompute',
    group   => 'orcacompute',
    mode    => '0600',
    content => template('orcacompute/platform.env.erb'),
    require => Vcsrepo['/opt/orcacompute/platform'],
    notify  => Service['orcacompute-platform'],
  }

  # Docker Compose configuration
  file { '/opt/orcacompute/platform/docker-compose.production.yml':
    ensure  => file,
    owner   => 'orcacompute',
    group   => 'orcacompute',
    mode    => '0644',
    content => template('orcacompute/docker-compose.production.yml.erb'),
    require => Vcsrepo['/opt/orcacompute/platform'],
    notify  => Service['orcacompute-platform'],
  }

  # Systemd service for platform
  file { '/etc/systemd/system/orcacompute-platform.service':
    ensure  => file,
    owner   => 'root',
    group   => 'root',
    mode    => '0644',
    content => template('orcacompute/orcacompute-platform.service.erb'),
    notify  => [Exec['systemd-reload'], Service['orcacompute-platform']],
  }

  # Reload systemd
  exec { 'systemd-reload':
    command     => 'systemctl daemon-reload',
    refreshonly => true,
  }

  # Platform service
  service { 'orcacompute-platform':
    ensure  => running,
    enable  => true,
    require => [
      File['/etc/systemd/system/orcacompute-platform.service'],
      File['/opt/orcacompute/platform/.env'],
      Exec['systemd-reload'],
    ],
  }

  # Backup configuration
  if $backup_enabled {
    include orcacompute::backup
  }

  # SSL configuration
  if $enable_ssl {
    include orcacompute::ssl
  }

  # Log rotation
  file { '/etc/logrotate.d/orcacompute-platform':
    ensure  => file,
    owner   => 'root',
    group   => 'root',
    mode    => '0644',
    content => template('orcacompute/logrotate.conf.erb'),
  }

  # Health check script
  file { '/usr/local/bin/orcacompute-health-check':
    ensure  => file,
    owner   => 'root',
    group   => 'root',
    mode    => '0755',
    content => template('orcacompute/health-check.sh.erb'),
  }

  # Cron job for health checks
  cron { 'orcacompute-health-check':
    command => '/usr/local/bin/orcacompute-health-check',
    user    => 'orcacompute',
    minute  => '*/5',  # Every 5 minutes
    require => File['/usr/local/bin/orcacompute-health-check'],
  }
}