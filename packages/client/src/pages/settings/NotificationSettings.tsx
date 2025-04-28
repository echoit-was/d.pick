import { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  FormControlLabel,
  Switch,
  Divider,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  SelectChangeEvent,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Chip,
  Button,
  TextField
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  Email as EmailIcon,
  Sms as SmsIcon,
  Delete as DeleteIcon,
  Add as AddIcon
} from '@mui/icons-material';

// 알림 유형 및 설정 인터페이스
interface NotificationSetting {
  id: string;
  type: string;
  enabled: boolean;
  channel: 'email' | 'sms' | 'push' | 'all';
}

interface CustomNotification {
  id: number;
  name: string;
  description: string;
  channel: 'email' | 'sms' | 'push' | 'all';
  enabled: boolean;
}

export default function NotificationSettings() {
  // 시스템 알림 설정
  const [systemNotifications, setSystemNotifications] = useState<NotificationSetting[]>([
    { id: 'task_assigned', type: '작업 할당', enabled: true, channel: 'all' },
    { id: 'task_completed', type: '작업 완료', enabled: true, channel: 'email' },
    { id: 'task_overdue', type: '작업 기한 초과', enabled: true, channel: 'all' },
    { id: 'project_update', type: '프로젝트 업데이트', enabled: false, channel: 'email' },
    { id: 'team_mention', type: '팀 멘션', enabled: true, channel: 'push' },
    { id: 'comment_mention', type: '댓글 멘션', enabled: true, channel: 'push' },
  ]);

  // 사용자 정의 알림
  const [customNotifications, setCustomNotifications] = useState<CustomNotification[]>([
    { id: 1, name: '주간 보고서', description: '매주 월요일 프로젝트 진행 상황 요약', channel: 'email', enabled: true },
    { id: 2, name: '예산 경고', description: '프로젝트 예산의 80% 이상 사용 시 알림', channel: 'all', enabled: true },
  ]);

  // 새 사용자 정의 알림
  const [newCustomNotif, setNewCustomNotif] = useState({
    name: '',
    description: '',
    channel: 'email' as 'email' | 'sms' | 'push' | 'all'
  });

  // 전체 알림 설정
  const [globalSettings, setGlobalSettings] = useState({
    allNotificationsEnabled: true,
    emailNotificationsEnabled: true,
    smsNotificationsEnabled: true,
    pushNotificationsEnabled: true,
    doNotDisturbFrom: '22:00',
    doNotDisturbTo: '07:00',
    doNotDisturbEnabled: true
  });

  // 알림 활성화/비활성화 토글 핸들러
  const handleSystemNotificationToggle = (id: string) => {
    setSystemNotifications(systemNotifications.map(notification => 
      notification.id === id 
        ? { ...notification, enabled: !notification.enabled } 
        : notification
    ));
  };

  // 알림 채널 변경 핸들러
  const handleChannelChange = (id: string, event: SelectChangeEvent) => {
    const channel = event.target.value as 'email' | 'sms' | 'push' | 'all';
    setSystemNotifications(systemNotifications.map(notification => 
      notification.id === id 
        ? { ...notification, channel } 
        : notification
    ));
  };

  // 사용자 정의 알림 토글 핸들러
  const handleCustomNotificationToggle = (id: number) => {
    setCustomNotifications(customNotifications.map(notification => 
      notification.id === id 
        ? { ...notification, enabled: !notification.enabled } 
        : notification
    ));
  };

  // 사용자 정의 알림 삭제 핸들러
  const handleDeleteCustomNotification = (id: number) => {
    setCustomNotifications(customNotifications.filter(notification => notification.id !== id));
  };

  // 사용자 정의 알림 채널 변경 핸들러
  const handleCustomChannelChange = (id: number, event: SelectChangeEvent) => {
    const channel = event.target.value as 'email' | 'sms' | 'push' | 'all';
    setCustomNotifications(customNotifications.map(notification => 
      notification.id === id 
        ? { ...notification, channel } 
        : notification
    ));
  };

  // 새 사용자 정의 알림 추가 핸들러
  const handleAddCustomNotification = () => {
    if (newCustomNotif.name.trim() === '') return;
    
    const newNotification: CustomNotification = {
      id: Date.now(),
      name: newCustomNotif.name,
      description: newCustomNotif.description,
      channel: newCustomNotif.channel,
      enabled: true
    };
    
    setCustomNotifications([...customNotifications, newNotification]);
    setNewCustomNotif({
      name: '',
      description: '',
      channel: 'email'
    });
  };

  // 새 사용자 정의 알림 입력 핸들러
  const handleNewCustomNotifChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setNewCustomNotif({
      ...newCustomNotif,
      [name]: value
    });
  };

  // 새 사용자 정의 알림 채널 변경 핸들러
  const handleNewCustomChannelChange = (event: SelectChangeEvent) => {
    setNewCustomNotif({
      ...newCustomNotif,
      channel: event.target.value as 'email' | 'sms' | 'push' | 'all'
    });
  };

  // 전역 설정 토글 핸들러
  const handleGlobalSettingToggle = (setting: keyof typeof globalSettings) => {
    setGlobalSettings({
      ...globalSettings,
      [setting]: !globalSettings[setting as keyof typeof globalSettings]
    });
  };

  // 전역 시간 설정 핸들러
  const handleTimeChange = (setting: string, event: React.ChangeEvent<HTMLInputElement>) => {
    setGlobalSettings({
      ...globalSettings,
      [setting]: event.target.value
    });
  };

  // 알림 채널 아이콘 렌더링 함수
  const renderChannelIcon = (channel: string) => {
    switch(channel) {
      case 'email':
        return <EmailIcon fontSize="small" />;
      case 'sms':
        return <SmsIcon fontSize="small" />;
      case 'push':
        return <NotificationsIcon fontSize="small" />;
      case 'all':
        return (
          <>
            <EmailIcon fontSize="small" />
            <SmsIcon fontSize="small" sx={{ mx: 0.5 }} />
            <NotificationsIcon fontSize="small" />
          </>
        );
      default:
        return <NotificationsIcon fontSize="small" />;
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        알림 설정
      </Typography>
      
      <Grid container spacing={3}>
        {/* 전역 알림 설정 */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              전역 알림 설정
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={globalSettings.allNotificationsEnabled}
                      onChange={() => handleGlobalSettingToggle('allNotificationsEnabled')}
                      color="primary"
                    />
                  }
                  label="모든 알림 활성화"
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={globalSettings.doNotDisturbEnabled}
                      onChange={() => handleGlobalSettingToggle('doNotDisturbEnabled')}
                      color="primary"
                    />
                  }
                  label="방해 금지 시간 설정"
                />
              </Grid>
              
              {globalSettings.doNotDisturbEnabled && (
                <>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="시작 시간"
                      type="time"
                      value={globalSettings.doNotDisturbFrom}
                      onChange={(e) => handleTimeChange('doNotDisturbFrom', e as React.ChangeEvent<HTMLInputElement>)}
                      InputLabelProps={{ shrink: true }}
                      fullWidth
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="종료 시간"
                      type="time"
                      value={globalSettings.doNotDisturbTo}
                      onChange={(e) => handleTimeChange('doNotDisturbTo', e as React.ChangeEvent<HTMLInputElement>)}
                      InputLabelProps={{ shrink: true }}
                      fullWidth
                    />
                  </Grid>
                </>
              )}
              
              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
                <Typography variant="subtitle1" gutterBottom>
                  알림 채널 설정
                </Typography>
              </Grid>
              
              <Grid item xs={12} sm={4}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={globalSettings.emailNotificationsEnabled}
                      onChange={() => handleGlobalSettingToggle('emailNotificationsEnabled')}
                      color="primary"
                    />
                  }
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <EmailIcon sx={{ mr: 1 }} /> 이메일 알림
                    </Box>
                  }
                />
              </Grid>
              
              <Grid item xs={12} sm={4}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={globalSettings.smsNotificationsEnabled}
                      onChange={() => handleGlobalSettingToggle('smsNotificationsEnabled')}
                      color="primary"
                    />
                  }
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <SmsIcon sx={{ mr: 1 }} /> SMS 알림
                    </Box>
                  }
                />
              </Grid>
              
              <Grid item xs={12} sm={4}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={globalSettings.pushNotificationsEnabled}
                      onChange={() => handleGlobalSettingToggle('pushNotificationsEnabled')}
                      color="primary"
                    />
                  }
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <NotificationsIcon sx={{ mr: 1 }} /> 푸시 알림
                    </Box>
                  }
                />
              </Grid>
            </Grid>
          </Paper>
        </Grid>
        
        {/* 시스템 알림 설정 */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              시스템 알림
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              시스템에서 생성되는 알림을 설정합니다.
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            <List>
              {systemNotifications.map((notification) => (
                <ListItem
                  key={notification.id}
                  divider
                  secondaryAction={
                    <FormControlLabel
                      control={
                        <Switch
                          checked={notification.enabled}
                          onChange={() => handleSystemNotificationToggle(notification.id)}
                          disabled={!globalSettings.allNotificationsEnabled}
                        />
                      }
                      label=""
                    />
                  }
                >
                  <ListItemText
                    primary={notification.type}
                    secondary={
                      <FormControl variant="outlined" size="small" sx={{ mt: 1, minWidth: 120 }}>
                        <InputLabel>알림 채널</InputLabel>
                        <Select
                          value={notification.channel}
                          onChange={(e) => handleChannelChange(notification.id, e)}
                          label="알림 채널"
                          disabled={!notification.enabled || !globalSettings.allNotificationsEnabled}
                        >
                          <MenuItem value="email">
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <EmailIcon fontSize="small" sx={{ mr: 1 }} />
                              이메일
                            </Box>
                          </MenuItem>
                          <MenuItem value="sms">
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <SmsIcon fontSize="small" sx={{ mr: 1 }} />
                              SMS
                            </Box>
                          </MenuItem>
                          <MenuItem value="push">
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <NotificationsIcon fontSize="small" sx={{ mr: 1 }} />
                              푸시
                            </Box>
                          </MenuItem>
                          <MenuItem value="all">
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              모든 채널
                            </Box>
                          </MenuItem>
                        </Select>
                      </FormControl>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>
        
        {/* 사용자 정의 알림 설정 */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              사용자 정의 알림
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              직접 생성하고 관리하는 알림을 설정합니다.
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            <List>
              {customNotifications.map((notification) => (
                <ListItem
                  key={notification.id}
                  divider
                  secondaryAction={
                    <Box>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={notification.enabled}
                            onChange={() => handleCustomNotificationToggle(notification.id)}
                            disabled={!globalSettings.allNotificationsEnabled}
                          />
                        }
                        label=""
                      />
                      <IconButton 
                        edge="end" 
                        aria-label="delete" 
                        onClick={() => handleDeleteCustomNotification(notification.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  }
                >
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {notification.name}
                        <Chip 
                          size="small" 
                          icon={renderChannelIcon(notification.channel)} 
                          label={
                            notification.channel === 'email' ? '이메일' :
                            notification.channel === 'sms' ? 'SMS' :
                            notification.channel === 'push' ? '푸시' : '모든 채널'
                          }
                          sx={{ ml: 1 }}
                        />
                      </Box>
                    }
                    secondary={
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          {notification.description}
                        </Typography>
                        <FormControl variant="outlined" size="small" sx={{ mt: 1, minWidth: 120 }}>
                          <InputLabel>알림 채널</InputLabel>
                          <Select
                            value={notification.channel}
                            onChange={(e) => handleCustomChannelChange(notification.id, e)}
                            label="알림 채널"
                            disabled={!notification.enabled || !globalSettings.allNotificationsEnabled}
                          >
                            <MenuItem value="email">이메일</MenuItem>
                            <MenuItem value="sms">SMS</MenuItem>
                            <MenuItem value="push">푸시</MenuItem>
                            <MenuItem value="all">모든 채널</MenuItem>
                          </Select>
                        </FormControl>
                      </Box>
                    }
                  />
                </ListItem>
              ))}
            </List>
            
            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle1" gutterBottom>
                새 알림 추가
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="알림 이름"
                    name="name"
                    value={newCustomNotif.name}
                    onChange={handleNewCustomNotifChange}
                    placeholder="예: 주간 보고서 알림"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="알림 설명"
                    name="description"
                    value={newCustomNotif.description}
                    onChange={handleNewCustomNotifChange}
                    placeholder="예: 매주 월요일에 프로젝트 진행 상황 요약 보내기"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>알림 채널</InputLabel>
                    <Select
                      value={newCustomNotif.channel}
                      onChange={handleNewCustomChannelChange}
                      label="알림 채널"
                    >
                      <MenuItem value="email">이메일</MenuItem>
                      <MenuItem value="sms">SMS</MenuItem>
                      <MenuItem value="push">푸시</MenuItem>
                      <MenuItem value="all">모든 채널</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={handleAddCustomNotification}
                    fullWidth
                    sx={{ height: '100%' }}
                    disabled={!newCustomNotif.name}
                  >
                    알림 추가
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
} 