import React, { useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  Chip,
  OutlinedInput,
  Autocomplete,
  FormHelperText,
  SelectChangeEvent
} from '@mui/material';
import { Developer, DeveloperLevel, DeveloperType, PaymentStatus } from '../pages/Developers';

interface DeveloperAddFormProps {
  open: boolean;
  onClose: () => void;
  onSave: (developer: Partial<Developer>) => void;
  initialData?: Partial<Developer>;
  isEdit?: boolean;
}

const DeveloperAddForm: React.FC<DeveloperAddFormProps> = ({
  open,
  onClose,
  onSave,
  initialData,
  isEdit = false
}) => {
  const [formData, setFormData] = useState<Partial<Developer>>(initialData || {
    name: '',
    birthDate: '',
    email: '',
    phone: '',
    skills: [],
    experienceYears: 0,
    level: '초급',
    type: '프론트엔드개발자',
    currentProjects: [],
    projectStartDate: '',
    projectEndDate: '',
    contacts: [],
    nextProjects: [],
    expectedStartDate: '',
    paymentDate: '',
    expectedSalary: 0,
    paymentStatus: '미지급',
  });

  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [skillInput, setSkillInput] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // 에러 상태 초기화
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const handleSelectChange = (e: SelectChangeEvent) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numValue = value === '' ? 0 : Number(value);
    
    setFormData({
      ...formData,
      [name]: numValue
    });
  };

  const handleAddSkill = () => {
    if (skillInput.trim() === '') return;
    
    if (!formData.skills) {
      setFormData({
        ...formData,
        skills: [skillInput.trim()]
      });
    } else {
      setFormData({
        ...formData,
        skills: [...formData.skills, skillInput.trim()]
      });
    }
    
    setSkillInput('');
  };

  const handleDeleteSkill = (skillToDelete: string) => {
    if (!formData.skills) return;
    
    setFormData({
      ...formData,
      skills: formData.skills.filter(skill => skill !== skillToDelete)
    });
  };

  const validateForm = (): boolean => {
    const newErrors: {[key: string]: string} = {};
    
    if (!formData.name) {
      newErrors.name = '이름을 입력해주세요';
    }
    
    if (!formData.email) {
      newErrors.email = '이메일을 입력해주세요';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = '유효한 이메일 주소를 입력해주세요';
    }
    
    if (!formData.phone) {
      newErrors.phone = '전화번호를 입력해주세요';
    }
    
    if (!formData.birthDate) {
      newErrors.birthDate = '생년월일을 입력해주세요';
    }
    
    if (formData.skills && formData.skills.length === 0) {
      newErrors.skills = '하나 이상의 기술을 입력해주세요';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSave(formData);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {isEdit ? '개발자 정보 수정' : '새 개발자 추가'}
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          <Grid container spacing={3}>
            {/* 기본 정보 */}
            <Grid item xs={12}>
              <Typography variant="subtitle1" fontWeight={500} gutterBottom>
                기본 정보
              </Typography>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="이름"
                name="name"
                value={formData.name || ''}
                onChange={handleChange}
                error={!!errors.name}
                helperText={errors.name}
                required
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="생년월일"
                name="birthDate"
                type="date"
                value={formData.birthDate || ''}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
                error={!!errors.birthDate}
                helperText={errors.birthDate}
                required
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="이메일"
                name="email"
                type="email"
                value={formData.email || ''}
                onChange={handleChange}
                error={!!errors.email}
                helperText={errors.email}
                required
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="전화번호"
                name="phone"
                value={formData.phone || ''}
                onChange={handleChange}
                placeholder="010-1234-5678"
                error={!!errors.phone}
                helperText={errors.phone}
                required
              />
            </Grid>
            
            {/* 경력 및 기술 정보 */}
            <Grid item xs={12} sx={{ mt: 2 }}>
              <Typography variant="subtitle1" fontWeight={500} gutterBottom>
                경력 및 기술 정보
              </Typography>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="경력 연차"
                name="experienceYears"
                type="number"
                value={formData.experienceYears || 0}
                onChange={handleNumberChange}
                InputProps={{ inputProps: { min: 0 } }}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>등급</InputLabel>
                <Select
                  name="level"
                  value={formData.level || '초급'}
                  label="등급"
                  onChange={handleSelectChange}
                >
                  <MenuItem value="초급">초급</MenuItem>
                  <MenuItem value="중급">중급</MenuItem>
                  <MenuItem value="고급">고급</MenuItem>
                  <MenuItem value="특급">특급</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>개발자 타입</InputLabel>
                <Select
                  name="type"
                  value={formData.type || '프론트엔드개발자'}
                  label="개발자 타입"
                  onChange={handleSelectChange}
                >
                  <MenuItem value="프론트엔드개발자">프론트엔드개발자</MenuItem>
                  <MenuItem value="백엔드개발자">백엔드개발자</MenuItem>
                  <MenuItem value="컨설턴트">컨설턴트</MenuItem>
                  <MenuItem value="프론트엔드PM">프론트엔드 PM</MenuItem>
                  <MenuItem value="백엔드PM">백엔드 PM</MenuItem>
                  <MenuItem value="PO">PO</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12}>
              <Box>
                <Typography variant="body2" gutterBottom>
                  보유 기술
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 1 }}>
                  {formData.skills && formData.skills.map((skill, index) => (
                    <Chip
                      key={index}
                      label={skill}
                      onDelete={() => handleDeleteSkill(skill)}
                    />
                  ))}
                </Box>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <TextField
                    size="small"
                    placeholder="기술 입력"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddSkill();
                      }
                    }}
                    error={!!errors.skills}
                  />
                  <Button
                    variant="outlined"
                    onClick={handleAddSkill}
                  >
                    추가
                  </Button>
                </Box>
                {errors.skills && (
                  <FormHelperText error>{errors.skills}</FormHelperText>
                )}
              </Box>
            </Grid>
            
            {/* 프로젝트 정보 */}
            <Grid item xs={12} sx={{ mt: 2 }}>
              <Typography variant="subtitle1" fontWeight={500} gutterBottom>
                프로젝트 정보
              </Typography>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="프로젝트 시작일"
                name="projectStartDate"
                type="date"
                value={formData.projectStartDate || ''}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="프로젝트 종료 예정일"
                name="projectEndDate"
                type="date"
                value={formData.projectEndDate || ''}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="다음 프로젝트 투입 예정일"
                name="expectedStartDate"
                type="date"
                value={formData.expectedStartDate || ''}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            
            {/* 급여 정보 */}
            <Grid item xs={12} sx={{ mt: 2 }}>
              <Typography variant="subtitle1" fontWeight={500} gutterBottom>
                급여 정보
              </Typography>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="급여일"
                name="paymentDate"
                type="date"
                value={formData.paymentDate || ''}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="예상 급여"
                name="expectedSalary"
                type="number"
                value={formData.expectedSalary || 0}
                onChange={handleNumberChange}
                InputProps={{ inputProps: { min: 0 } }}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>지급 상태</InputLabel>
                <Select
                  name="paymentStatus"
                  value={formData.paymentStatus || '미지급'}
                  label="지급 상태"
                  onChange={handleSelectChange}
                >
                  <MenuItem value="미지급">미지급</MenuItem>
                  <MenuItem value="지급예정">지급예정</MenuItem>
                  <MenuItem value="지급완료">지급완료</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>취소</Button>
        <Button onClick={handleSubmit} variant="contained">
          {isEdit ? '수정' : '추가'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeveloperAddForm; 